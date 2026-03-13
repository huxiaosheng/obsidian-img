export async function onRequest(context) {
  // 1. 从 URL 参数获取文件名 (例如 ?key=test.jpg)
  const { searchParams } = new URL(context.request.url);
  const key = searchParams.get('key');

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  // 2. 使用刚才绑定的变量 MY_BUCKET 读取 R2
  const object = await context.env.MY_BUCKET.get(key);

  if (object === null) {
    return new Response("Object Not Found", { status: 404 });
  }

  // 3. 返回图片流
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers,
  });
}