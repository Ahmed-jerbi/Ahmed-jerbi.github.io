import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const bucketName = "jules-media";

const allowedTypes: Record<string, { kind: "image" | "video" | "audio"; extension: string }> = {
  "image/jpeg": { kind: "image", extension: "jpg" },
  "image/png": { kind: "image", extension: "png" },
  "image/webp": { kind: "image", extension: "webp" },
  "image/gif": { kind: "image", extension: "gif" },
  "video/mp4": { kind: "video", extension: "mp4" },
  "video/webm": { kind: "video", extension: "webm" },
  "video/quicktime": { kind: "video", extension: "mov" },
  "audio/mpeg": { kind: "audio", extension: "mp3" },
  "audio/mp4": { kind: "audio", extension: "m4a" },
  "audio/ogg": { kind: "audio", extension: "ogg" },
  "audio/wav": { kind: "audio", extension: "wav" },
  "audio/webm": { kind: "audio", extension: "webm" },
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function digest(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}

async function passphrasesMatch(candidate: string, expected: string) {
  const [candidateHash, expectedHash] = await Promise.all([
    digest(candidate),
    digest(expected),
  ]);
  let difference = 0;
  for (let index = 0; index < expectedHash.length; index += 1) {
    difference |= candidateHash[index] ^ expectedHash[index];
  }
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  let serverKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!serverKey) {
    try {
      const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
      serverKey = secretKeys.default ?? "";
    } catch {
      serverKey = "";
    }
  }
  if (!supabaseUrl || !serverKey) {
    return json({ error: "Configuration serveur incomplète." }, 500);
  }

  const supabase = createClient(supabaseUrl, serverKey, {
    auth: { persistSession: false },
  });

  if (request.method === "GET") {
    const { data: entries, error } = await supabase
      .from("jules_timeline_entries")
      .select("id,title,event_date,description,created_at")
      .order("event_date", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return json({ error: "Impossible de charger les souvenirs." }, 500);
    if (!entries?.length) return json({ entries: [] });

    const { data: mediaFiles, error: mediaError } = await supabase
      .from("jules_timeline_media")
      .select("entry_id,media_type,storage_path,sort_order")
      .in("entry_id", entries.map((entry) => entry.id))
      .order("sort_order", { ascending: true });

    if (mediaError) return json({ error: "Impossible de charger les médias." }, 500);

    return json({
      entries: entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        eventDate: entry.event_date,
        description: entry.description,
        media: (mediaFiles ?? [])
          .filter((media) => media.entry_id === entry.id)
          .map((media) => ({
            type: media.media_type,
            url: supabase.storage.from(bucketName).getPublicUrl(media.storage_path).data.publicUrl,
          })),
      })),
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }

  const configuredPassphrase = Deno.env.get("JULES_EDITOR_PASSPHRASE");
  if (!configuredPassphrase) {
    return json({ error: "Le mot de passe éditeur n’est pas configuré." }, 500);
  }

  if (request.headers.get("content-type")?.includes("application/json")) {
    let payload: Record<string, unknown>;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Requête invalide." }, 400);
    }

    const passphrase = String(payload.passphrase ?? "");
    if (!(await passphrasesMatch(passphrase, configuredPassphrase))) {
      return json({ error: "Mot de passe incorrect." }, 401);
    }

    const action = String(payload.action ?? "");
    if (action === "authorize") return json({ authorized: true });

    const id = String(payload.id ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return json({ error: "Souvenir invalide." }, 400);
    }

    if (action === "update") {
      const title = String(payload.title ?? "").trim();
      const eventDate = String(payload.eventDate ?? "");
      const description = String(payload.description ?? "").trim();
      if (!title || title.length > 80 || description.length > 500 ||
          !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
        return json({ error: "Vérifiez le titre, la date et le message." }, 400);
      }

      const { error } = await supabase
        .from("jules_timeline_entries")
        .update({ title, event_date: eventDate, description })
        .eq("id", id);
      if (error) return json({ error: "La modification a échoué." }, 500);
      return json({ updated: true });
    }

    if (action === "delete") {
      const { data: mediaFiles, error: lookupError } = await supabase
        .from("jules_timeline_media")
        .select("storage_path")
        .eq("entry_id", id);
      if (lookupError) return json({ error: "Souvenir introuvable." }, 404);

      const { error: deleteError } = await supabase
        .from("jules_timeline_entries")
        .delete()
        .eq("id", id);
      if (deleteError) return json({ error: "La suppression a échoué." }, 500);

      const storagePaths = (mediaFiles ?? []).map((media) => media.storage_path);
      if (storagePaths.length) await supabase.storage.from(bucketName).remove(storagePaths);
      return json({ deleted: true });
    }

    return json({ error: "Action inconnue." }, 400);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Formulaire invalide." }, 400);
  }

  const passphrase = String(form.get("passphrase") ?? "");
  if (!(await passphrasesMatch(passphrase, configuredPassphrase))) {
    return json({ error: "Mot de passe incorrect." }, 401);
  }

  const title = String(form.get("title") ?? "").trim();
  const eventDate = String(form.get("eventDate") ?? "");
  const description = String(form.get("description") ?? "").trim();
  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  const action = String(form.get("action") ?? "create");
  const isUpdate = action === "update";
  const requestedId = String(form.get("id") ?? "");

  if (!title || title.length > 80 || description.length > 500) {
    return json({ error: "Vérifiez le titre et le message." }, 400);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    return json({ error: "Date invalide." }, 400);
  }
  if (isUpdate && !/^[0-9a-f-]{36}$/i.test(requestedId)) {
    return json({ error: "Souvenir invalide." }, 400);
  }
  if ((!isUpdate && !files.length) || files.length > 10) {
    return json({ error: "Choisissez entre 1 et 10 fichiers." }, 400);
  }

  const unsupportedFile = files.find((file) => !allowedTypes[file.type]);
  if (unsupportedFile) {
    return json({ error: "Un format de fichier n’est pas accepté." }, 415);
  }
  const totalSize = files.reduce((size, file) => size + file.size, 0);
  if (totalSize > 50 * 1024 * 1024) {
    return json({ error: "Les fichiers dépassent la limite totale de 50 Mo." }, 413);
  }

  if (isUpdate && !files.length) {
    const { error } = await supabase
      .from("jules_timeline_entries")
      .update({ title, event_date: eventDate, description })
      .eq("id", requestedId);
    if (error) return json({ error: "La modification a échoué." }, 500);
    return json({ updated: true });
  }

  let entryId = requestedId;
  let oldStoragePaths: string[] = [];

  if (isUpdate) {
    const { data: oldMedia, error } = await supabase
      .from("jules_timeline_media")
      .select("storage_path")
      .eq("entry_id", entryId);
    if (error) return json({ error: "Les médias actuels sont introuvables." }, 500);
    oldStoragePaths = (oldMedia ?? []).map((media) => media.storage_path);
  } else {
    const { data: entry, error } = await supabase
      .from("jules_timeline_entries")
      .insert({ title, event_date: eventDate, description })
      .select("id")
      .single();
    if (error || !entry) return json({ error: "Le souvenir n’a pas pu être enregistré." }, 500);
    entryId = entry.id;
  }

  const uploadedPaths: string[] = [];
  const mediaRows: Array<{
    entry_id: string;
    media_type: "image" | "video" | "audio";
    storage_path: string;
    sort_order: number;
  }> = [];

  for (const [index, file] of files.entries()) {
    const media = allowedTypes[file.type];
    const storagePath = `${eventDate}/${crypto.randomUUID()}.${media.extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      if (uploadedPaths.length) await supabase.storage.from(bucketName).remove(uploadedPaths);
      if (!isUpdate) await supabase.from("jules_timeline_entries").delete().eq("id", entryId);
      return json({ error: "L’envoi des fichiers a échoué." }, 500);
    }

    uploadedPaths.push(storagePath);
    mediaRows.push({
      entry_id: entryId,
      media_type: media.kind,
      storage_path: storagePath,
      sort_order: index,
    });
  }

  const { error: mediaInsertError } = await supabase
    .from("jules_timeline_media")
    .insert(mediaRows);

  if (mediaInsertError) {
    await supabase.storage.from(bucketName).remove(uploadedPaths);
    if (!isUpdate) await supabase.from("jules_timeline_entries").delete().eq("id", entryId);
    return json({ error: "Les médias n’ont pas pu être enregistrés." }, 500);
  }

  if (isUpdate) {
    const { error: updateError } = await supabase
      .from("jules_timeline_entries")
      .update({ title, event_date: eventDate, description })
      .eq("id", entryId);

    if (updateError) {
      await supabase.from("jules_timeline_media").delete().in("storage_path", uploadedPaths);
      await supabase.storage.from(bucketName).remove(uploadedPaths);
      return json({ error: "La modification a échoué." }, 500);
    }

    if (oldStoragePaths.length) {
      const { error: deleteOldMediaError } = await supabase
        .from("jules_timeline_media")
        .delete()
        .in("storage_path", oldStoragePaths);
      if (deleteOldMediaError) {
        await supabase.from("jules_timeline_media").delete().in("storage_path", uploadedPaths);
        await supabase.storage.from(bucketName).remove(uploadedPaths);
        return json({ error: "Le remplacement des médias a échoué." }, 500);
      }
      await supabase.storage.from(bucketName).remove(oldStoragePaths);
    }

    return json({ updated: true });
  }

  return json({ created: true }, 201);
});
