# writing Room API
This is an api for writing-room. MVEND Internship Interview Challenge 

---
## Built with
- Nodejs
- Express.js
- MySQL
- Javascript
---

### Links

<!-- - Solution URL: https://github.com/KorkuTegbe/Blog-API
- Live Site URL: https://myblogapi.cyclic.app/ -->
---
## Requirements
<details>
<summary>Project Requirements</summary>
<!-- 1. Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs. 
  a. The endpoint should be paginated
  b. It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, 
  a. default it to 20 blogs per page. 
  b. It should also be searchable by author, title and tags.
  c. It should also be orderable by read_count, reading_time and timestamp
15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
16. Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for all endpoints -->
</details>

---
## Setup
- Install NodeJS, mysql
- pull this repo
- update env 
- run `npm install` to install project dependencies
- run `npm run start` to run the application

---
<!-- ## Base URL
- https://myblogapi.cyclic.app/ -->


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  number |  required |
|  email |  string |  required, unique |
|  firstName | string  |  required |
|  lastName  |  string |  required  |
|  password     | string  |  required |
|  username     | string  |  required, unique |
|  createdAt  | date  |   |
|  updatedAt  | date  |   |


### Article
| field  |  data_type | constraints  |
|---|---|---|
|  title |  string |  required |
|  content | string  |  required|
|  media_urls  |  json |  max:4  |
|  state |   string |  required, default: 'draft', enum: ['draft', 'published']  |
|  views |  number |  required, default: 0 |
|  reading_time |  number |   |
|  likesNo     | number  |  default: 0 |
|  createdAt |  date |   |
|  updatedAt    | date  |   |


### Comment
| field  |  data_type | constraints  |
|---|---|---|
|  comment |  string |  required |
|  userId | number  |  required |
|  articleId  |  number |  max:4  |
|  createdAt |  date |   |
|  updatedAt    | date  |   |


## APIs
---
## USER

### Signup User

- Route: /api/v1/users/signup
- Method: POST
- Body: 
```
{
  "firstName": "Some",
  "lastName": "User",
  "email": "someuser@mail.com",
  "password": "somepassword",
  "username": "someuser"
}
```

- Responses

    - Success
```
{
  "status": "success",
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": 6,
      "firstName": "Some",
      "lastName": "User",
      "email": "someuser@mail.com",
      "username": "someuser",
      "updatedAt": "2023-03-09T11:11:55.099Z",
      "createdAt": "2023-03-09T11:11:55.099Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NzgzNjAzMTUsImV4cCI6MTY3ODM2MzkxNX0.cI10fyFB2rDp-QHMJoJgv9oS38Hw9zuCO6KSVFonEn4"
  }
}
```
- error
```
{
    status: "error",
    message: 'error message',
}
```

---
### Login User

- Route: /api/v1/users/login
- Method: POST
- Body: 
```
{
  email": "someuser@mail.com",
  "password": "somepassword",
}
```

- Responses

    - Success
```
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 6,
      "firstName": "Some",
      "lastName": "User",
      "email": "someuser@mail.com",
      "username": "someuser",
      "createdAt": "2023-03-09T11:11:55.000Z",
      "updatedAt": "2023-03-09T11:11:55.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NzgzNjA1MjEsImV4cCI6MTY3ODM2NDEyMX0.VdBzLLdfC84mzk5jfnmCYRKVSlJykp8tSrSJYu_c6J8"
  }
}
```
- error
```
{
  "status": "error",
  "message": error message,
}

```
## ARTICLE
---
### Draft article (logged in user)

- Route: /api/v1/article/
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: Form-data
```
| KEY  |  VALUE |
|---|---|
|title | This is the title |
| content | Content goes here |
| media_urls | Screenshot (3).png |
| media_urls | Screenshot (8).png |
```

- Responses

  - Success
```
{
  "status": "success",
  "message": "Draft saved",
  "data": {
    "article": {
      "likesNo": 0,
      "status": "Draft",
      "views": 0,
      "id": 5,
      "title": "This is the title",
      "content": "content goes here",
      "userId": 6,
      "reading_time": 1,
      "media_urls": [
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678361363/pictures/ullfb8xjtu1aj70b1ela.png",
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678361365/pictures/scslqkgqrlfd60yfdmdn.png"
      ],
      "updatedAt": "2023-03-09T11:29:20.852Z",
      "createdAt": "2023-03-09T11:29:20.852Z"
    }
  }
}
```
- error
```
{
  "status": "error",
  "message": error message,
}

```
---
### Publish/Update Article State (logged in owner)

- Route: /api/v1/article/publish/:articleId
- Method: PATCH
- Header
    - Authorization: Bearer {token}

- Responses
    - success
```
{
  "status": "success",
  "message": "Status updated",
  "data": {
    "article": {
      "id": 5,
      "title": "This is the title",
      "content": "content goes here",
      "media_urls": [
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678361363/pictures/ullfb8xjtu1aj70b1ela.png",
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678361365/pictures/scslqkgqrlfd60yfdmdn.png"
      ],
      "reading_time": 1,
      "likesNo": 0,
      "status": "Published",
      "views": 0,
      "userId": 6,
      "createdAt": "2023-03-09T11:29:20.000Z",
      "updatedAt": "2023-03-09T11:29:20.000Z"
    }
  }
}
```
 - error
```
{
  "status": "error",
  "message": error message,
}

```
---
### Edit article (logged in owner)

- Route: /api/v1/article/:articleId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body
```
| KEY  |  VALUE |
|---|---|
|title | This title has been edited |
| content | This is the content that will be updated |
| media_urls | Screenshot (3).png |
```
- Responses
    - success
```
{
  "status": "success",
  "message": "Article updated successfully",
  "data": {
    "updatedArticle": {
      "id": 5,
      "title": "This title has been edited",
      "content": "This is the content that will be updated. ",
      "media_urls": [
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678361363/pictures/ullfb8xjtu1aj70b1ela.png",
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678361365/pictures/scslqkgqrlfd60yfdmdn.png"
      ],
      "reading_time": 1,
      "likesNo": 0,
      "status": "Published",
      "views": 0,
      "userId": 6,
      "createdAt": "2023-03-09T11:29:20.000Z",
      "updatedAt": "2023-03-09T11:38:36.259Z"
    }
  }
}
```
 - error
```
{
  "status": "error",
  "message": error message,
}

```

### Delete user article (logged in owner)

- Route: /api/v1/article/:articleId
- Method: DELETE
- Header:
    - Authorization: Bearer {token}

- Responses
    - Success
```
{
  "status": "success",
  "message": "Article deleted successful"
}
```
 - error
```
{
  "status": "error",
  "message": error message,
}

```

### Get owner articles - logged in owner

- Route: /api/v1/article/
- Method: GET

- Responses

Success
```
{
  "status": "success",
  "results": 1,
  "data": {
    "articles": [{article}]
  }
}
```
- error
```
{
  "status": "error",
  "message": error message,
}

```
---

### Get A Published Article (all users - logged in or out)

- Route: /api/v1/article/:articleId
- Method: GET

- Responses

    - Success
```
{
  "status": "success",
  "data": {
    "article": {
      "id": 2,
      "title": "An edited title",
      "content": "This is the content that will be updated. I guess this sis the update. Listeining to gyedu baly ambulley because it's Ghana month. Yenkor. ",
      "media_urls": [
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678290965/pictures/u8oqmhngxwj8ozr1b9qg.png",
        "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678290966/pictures/uxweoa1dxpujxex0dojm.png"
      ],
      "reading_time": 1,
      "likesNo": 0,
      "status": "Published",
      "views": 5,
      "userId": 2,
      "createdAt": "2023-03-08T15:56:01.000Z",
      "updatedAt": "2023-03-09T05:20:07.451Z",
      "user": {
        "id": 2,
        "firstName": "Jona",
        "lastName": "Kupoa",
        "email": "jona@mail.com",
        "username": "jona",
        "createdAt": "2023-03-08T15:51:40.000Z",
        "updatedAt": "2023-03-08T15:51:40.000Z"
      },
      "comments": [
        {
          "id": 5,
          "comment": "this is another comment",
          "userId": 2,
          "articleId": 2,
          "createdAt": "2023-03-08T23:15:37.000Z",
          "updatedAt": "2023-03-08T23:15:37.000Z"
        }
      ]
    }
  }
}
```
- error
```
{
  "status": "error",
  "message": error message,
}

```

### Get Published Articles (all users - logged in or out)

- Route: /api/v1/article/all
- Method: GET
- Query params: 
    - limit (default: 10)
    - status(default: 'Published')
    - orderBy(updatedAt)

- Responses
    - Success
```
{
  "status": "success",
  "results": 2,
  "data": {
    "allArticles": [
      {
        "article": {
          "id": 2,
          "title": "An edited title",
          "content": "This is the content that will be updated. I guess this sis the update. Listeining to gyedu baly ambulley because it's Ghana month. Yenkor. ",
          "media_urls": [
            "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678290965/pictures/u8oqmhngxwj8ozr1b9qg.png",
            "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678290966/pictures/uxweoa1dxpujxex0dojm.png"
          ],
          "reading_time": 1,
          "likesNo": 0,
          "status": "Published",
          "views": 5,
          "userId": 2,
          "createdAt": "2023-03-08T15:56:01.000Z",
          "updatedAt": "2023-03-09T05:20:07.000Z",
          "user": {
            "id": 2,
            "firstName": "Jona",
            "lastName": "Kupoa",
            "email": "jona@mail.com",
            "username": "jona",
            "createdAt": "2023-03-08T15:51:40.000Z",
            "updatedAt": "2023-03-08T15:51:40.000Z"
          },
          "comments": [
            {
              "id": 5,
              "comment": "this is another comment",
              "userId": 2,
              "articleId": 2,
              "createdAt": "2023-03-08T23:15:37.000Z",
              "updatedAt": "2023-03-08T23:15:37.000Z"
            }
          ]
        }
      },
      {
        "article": {
          "id": 3,
          "title": "The writer's room",
          "content": "the writer's room is a room full of writers writing what writers normally write.",
          "media_urls": [
            "https://res.cloudinary.com/doxxo2k1j/image/upload/v1678314537/pictures/y7adqbfy5axqftfkysyy.png"
          ],
          "reading_time": 1,
          "likesNo": 0,
          "status": "Published",
          "views": 2,
          "userId": 2,
          "createdAt": "2023-03-08T22:29:01.000Z",
          "updatedAt": "2023-03-09T05:17:25.000Z",
          "user": {
            "id": 2,
            "firstName": "Jona",
            "lastName": "Kupoa",
            "email": "jona@mail.com",
            "username": "jona",
            "createdAt": "2023-03-08T15:51:40.000Z",
            "updatedAt": "2023-03-08T15:51:40.000Z"
          },
          "comments": []
        }
      }
    ]
  }
}
```
- error
```
{
  "status": "error",
  "message": error message,
}

```
---
## COMMENT

### Make a comment (logged in user)

- Route: /api/v1/comment/articleId
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body
```
  {
      "comment": "this is another comment"
  }
```
- Responses
    - success
```
{
  "status": "success",
  "data": {
    "comment": {
      "id": 10,
      "comment": "this is another comment",
      "userId": 6,
      "articleId": 2,
      "updatedAt": "2023-03-09T06:46:22.520Z",
      "createdAt": "2023-03-09T06:46:22.520Z"
    }
  }
}
```
 - error
```
{
  "status": "error",
  "message": error message,
}

```

### Delete a comment (logged in user)

- Route: /api/v1/comment/commentId
- Method: DELETE
- Header
    - Authorization: Bearer {token}

- Responses
    - success
```
{
  "message": "Comment deleted successfully"
}
```
 - error
```
{
  "status": "error",
  "message": error message,
}

```

### Get comments of an article

- Route: http://localhost:3334/api/v1/comment/articleId
- Method: GET

- Responses
    - success
```
{
  "status": "success",
  "results": 4,
  "data": {
    "allComments": [
      {
        "comment": {
          "id": 9,
          "comment": "this is another comment",
          "userId": 2,
          "articleId": 4,
          "createdAt": "2023-03-08T23:24:20.000Z",
          "updatedAt": "2023-03-08T23:24:20.000Z"
        }
      },
      {
        "comment": {
          "id": 8,
          "comment": "this is another comment",
          "userId": 2,
          "articleId": 4,
          "createdAt": "2023-03-08T23:22:01.000Z",
          "updatedAt": "2023-03-08T23:22:01.000Z"
        }
      },
      {
        "comment": {
          "id": 7,
          "comment": "this is another comment",
          "userId": 2,
          "articleId": 4,
          "createdAt": "2023-03-08T23:19:53.000Z",
          "updatedAt": "2023-03-08T23:19:53.000Z"
        }
      },
      {
        "comment": {
          "id": 2,
          "comment": "this is another comment",
          "userId": 2,
          "articleId": 4,
          "createdAt": "2023-03-08T23:14:48.000Z",
          "updatedAt": "2023-03-08T23:14:48.000Z"
        }
      }
    ]
  }
}
```
 - error
```
{
  "status": "error",
  "message": error message,
}

```

...

### Contributor
- Justice Etorko-Gbeku


