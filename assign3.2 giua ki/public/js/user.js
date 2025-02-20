import apiRequest from "./apirequest.js";

/* A small data model to represent a Post. */
export class Post {
  /* data is the post data from the API. */
  constructor(data) {
    /* Technically we don't have a full User object here (no followers list), but this is still useful. */
    this.user = new User(data.user);
    this.time = new Date(data.time);
    this.text = data.text;
  }
}

/* A data model representing a user of the app. */
export default class User {
  /* Returns an array of user IDs. */
  static async listUsers() {
    let data = await apiRequest("GET", "/users");
    return data.users;
  }
  constructor(data) {
    //TODO
    // Khởi tạo các biến thành viên từ dữ liệu truyền vào
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarURL;
    this.following = data.following;
  }

  /* Returns a User instance, creating the user if necessary. */
    static async loadOrCreate(id) {
    const userList = await this.listUsers();

    if (userList.includes(id)) {
      // Nếu id tồn tại trong userList thì get
      const response = await apiRequest(`GET`, `/users/${id}`);
      return new User(response);
    } else {
      // Nếu id không tồn tại trong userList thì tạo moi
      const response = await apiRequest(`POST`, `/users`,{id});
      return new User(response);
    }
  }
  /* data is the user object from the API. */
  

  /* The string representation of a User is their display name. */
  toString() {
    return this.name;
  }

  /* Returns an Object containing only the instances variables we want to send back to the API when we save() the user. */
  toJSON() {
    //TODO
    return {
      id: this.id,
      name: this.name,
      avatarURL: this.avatarURL,
      following: this.following,
    };

  }

  /* Save the current state (name and avatar URL) of the user to the server. */
  async save() {
    const response = await apiRequest(
      "PATCH",
      `/users/${this.id}`,
      this.toJSON()
    );
    
    Object.assign(this, response);
  }
  /* Gets the user's current feed. Returns an Array of Post objects. */
  async getFeed() {
    //TODO
    // Gọi apiRequest với endpoint 'users/:id/feed' và method 'GET' để lấy các bài đăng của người dùng
    const { posts } = await apiRequest(`GET`, `/users/${this.id}/feed`);

    return posts.map((post) => new Post(post));
  }

  /* Create a new post with hte given text. */
  async makePost(text) {
    const postData = await apiRequest(`POST`, `/users/${this.id}/posts`, {
      text,
    });
    //load nguoi dung
    // await User.loadOrCreate(postData.newPost.userId)

    return postData;
     
  }

  /* Start following the specified user id. Does not handle any HTTPErrors generated by the API. */
  /* Start following the specified user id. Does not handle any HTTPErrors generated by the API. */
  async addFollow(id) {
    await apiRequest(`POST`, `/users/${this.id}/follow?target=${id}`);
  }

  /* Stop following the specified user id. Does not handle any HTTPErrors generated by the API. */
  async deleteFollow(id) {
    await apiRequest(`DELETE`, `/users/${this.id}/follow?target=${id}`);
  }
  
}

