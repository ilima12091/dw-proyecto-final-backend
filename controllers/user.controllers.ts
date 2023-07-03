import executeSqlQuery from "../services/db-client";
import { User } from "../interface/user";

export const userData = {
  //Inserts user inforamtion into Users table
  async insertUser(newUser: User): Promise<void> {
    const query = `
          INSERT INTO Users (name, surname, email, password, username)
          VALUES ('${newUser.name}', '${newUser.surname}', '${newUser.email}', '${newUser.password}', '${newUser.username}')
        `;
    await executeSqlQuery(query);
  },

  //Returns user inforamtion from Users table by username
  async getUserByUsername(username: string): Promise<any> {
    const query = `
            SELECT * FROM Users WHERE username = '${username}'
          `;
    const result = await executeSqlQuery(query);

    if (result) {
      return result;
    } else {
      return null; // User not found
    }
  },

  

  async getUserById(user_id: number): Promise<any> {
    const query = `
      SELECT *
      FROM Users
      WHERE user_id = '${user_id}'
    `;
    const result = await executeSqlQuery(query);
  
    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      return null;
    }
  },
  

  async updateUserByUsername(
    username: string,
    updatedUser: User
  ): Promise<void> {
    const query = `
          UPDATE Users
          SET name = '${updatedUser.name}', surname = '${updatedUser.surname}',
          email = '${updatedUser.email}', password = '${updatedUser.password}'
          WHERE username = '${username}'
        `;
    await executeSqlQuery(query);
  },

  
  async updateUserById(
    user_id: number,
    updatedUser: User
  ): Promise<any> {
    const query = `
          UPDATE Users
          SET
            name = '${updatedUser.name}',
            surname = '${updatedUser.surname}',
            username = '${updatedUser.username}',
            password = '${updatedUser.password}'
          WHERE
            user_id = '${user_id}'
        `;

    await executeSqlQuery(query);

    // Return the updated user
    const updatedUserQuery = `SELECT * FROM Users WHERE user_id = '${user_id}'`;
    const result = await executeSqlQuery(updatedUserQuery);
    return result || null; // Return null if no user is found
  },

  async updateUserProfileImage(user_id:number, fileData:string){
    const query = `
          UPDATE Users
          SET profile_picture = '${fileData}'
          WHERE user_id = '${user_id}'
        `;

    try {
      // Execute the query to update the profile image
      const updatedUser = await executeSqlQuery(query);

      

      // Return the updated user
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile image:", error);
      return null;
    }
  },
};

