import sql from "mssql";

const executeSqlQuery = async (query: string) => {
  const dbConfig = {
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
    server: process.env.DB_HOST ?? "",
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      trustServerCertificate: false,
    },
  };

  try {
    await sql.connect(dbConfig);
    const result = await sql.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

export default executeSqlQuery;
