const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "090404",
  host: "185.170.153.5",
  port: "5432",
  database: "rutrackerposts_db",
}); 

module.exports.saveTorrents = async function saveTorrents(torrents) {
  await client.connect();
  const queries = [];
  for (const torrent of torrents) {
    queries.push(
      client.query(
        `SELECT add_posts('${torrent.id}', '${torrent.link}', '${torrent.title}',${torrent.seeds} , ${torrent.leaches}, '${torrent.size}');`
      )
    );
  }
  await Promise.all(queries);
  client.end();
};
