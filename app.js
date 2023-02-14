const express = require('express');
const axios = require('axios');

const app = express();

const commentsUrl = 'https://jsonplaceholder.typicode.com/comments';
const postsUrl = 'https://jsonplaceholder.typicode.com/posts';

app.get('/', async (req, res) => {
  try {
    // Fetch all the posts
    const { data: posts } = await axios.get(postsUrl);

    // Fetch all the comments
    const { data: comments } = await axios.get(commentsUrl);

    // Count the number of comments for each post
    const postsWithComments = posts.map(post => {

      var commentsForPost = comments.filter(comment => comment.postId === post.id);

      return {
        post_id: post.id,
        post_title: post.title,
        post_body: post.body,
        total_number_of_comments: commentsForPost.length,
      };
    });

    // Sort the posts by the number of comments in descending order
    const sortedPosts = postsWithComments.sort((a, b) => b.total_number_of_comments - a.total_number_of_comments);

    res.json(sortedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Search API endpoint to filter comments based on all the available fields
app.get('/search', async (req, res) => {
  const { postId, id, name, email, body, isActive } = req.query;
  try {
    const { data: comments } = await axios.get(commentsUrl);
    let filteredComments = comments;

    filteredComments.forEach(element => {
      element.isActive = true;
    });
    
    if (isActive){
      filteredComments = filteredComments.filter(comment => comment.isActive.toString() === isActive);
    }

    if (postId) {
      filteredComments = filteredComments.filter(comment => comment.postId.toString() === postId.toString());
    }

    if (id) {
      filteredComments = filteredComments.filter(comment => comment.id.toString() === id.toString());
    }

    if (name) {
      filteredComments = filteredComments.filter(comment => comment.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (email) {
      filteredComments = filteredComments.filter(comment => comment.email.toLowerCase().includes(email.toLowerCase()));
    }

    if (body) {
      filteredComments = filteredComments.filter(comment => comment.body.toLowerCase().includes(body.toLowerCase()));
    }

    res.json(filteredComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
