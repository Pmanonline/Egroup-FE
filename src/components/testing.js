import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { ThumbUp, Edit, Delete, Send, MoreVert } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import backendURL from "../../config";

const GroupDiscussionPage = () => {
  const { slug } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const currentUser = useSelector((state) => state.auth);
  const userId = currentUser?.userInfo?._id;
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyToDeleteId, setReplyToDeleteId] = useState(null);
  // console.log("");

 

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!discussion) return <Typography>Discussion not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {discussion.title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          src={`${backendURL}${discussion.authorId?.image}`}
          sx={{
            mr: 1,
            width: 25,
            height: 25,
            borderRadius: "50%",
          }}
        />
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          {discussion.author?.username || "Anonymous"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {safeFormatDate(discussion.createdAt)}
        </Typography>
      </Box>
      <Typography variant="body1" paragraph>
        {discussion.content}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={handleLikeDiscussion}>
          <ThumbUp
            color={
              Array.isArray(discussion.likes) &&
              discussion.likes.includes(userId)
                ? "primary"
                : "inherit"
            }
          />
        </IconButton>
        <Typography variant="body2">
          {Array.isArray(discussion.likes) ? discussion.likes.length : 0} likes
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h7" gutterBottom>
        Comments ({discussion?.comments.length || 0})
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Write your reply..."
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<Send />}
        onClick={handleCommentSubmit}
        disabled={!newReply.trim()}
      >
        Post Reply
      </Button>
      <List>
        {replies.map((reply) => (
          <ListItem key={reply._id} alignItems="flex-start" divider>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={`${backendURL}${reply.author?.image}`}
                      sx={{
                        mr: 1,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: "14px",
                        color: "gray",
                        fontWeight: "600",
                      }}
                    >
                      {reply.author?.username || "Anonymous"}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {safeFormatDate(reply.createdAt)}
                  </Typography>
                </Box>
              }
              secondary={
                editingReplyId === reply._id ? (
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={editedReplyContent}
                      onChange={(e) => setEditedReplyContent(e.target.value)}
                      variant="outlined"
                      sx={{ my: 1 }}
                    />
                    <Button
                      onClick={() =>
                        handleReplyEdit(reply._id, editedReplyContent)
                      }
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button onClick={() => setEditingReplyId(null)}>
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography>{reply.content}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <IconButton
                        onClick={() => handleLikeComment(reply._id)}
                        size="small"
                      >
                        <ThumbUp
                          fontSize="small"
                          color={
                            reply.likes?.includes(userId)
                              ? "primary"
                              : "inherit"
                          }
                        />
                      </IconButton>
                      <Typography variant="caption">
                        {reply.likes?.length} likes
                      </Typography>
                    </Box>
                  </Box>
                )
              }
            />
            {currentUser?.userInfo &&
              (currentUser?.userInfo._id === reply.author?._id ||
                currentUser.userInfo?.isAdmin) && (
                <IconButton
                  edge="end"
                  onClick={(event) => handleMenuOpen(event, reply._id)}
                >
                  <MoreVert />
                </IconButton>
              )}
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            handleEditClick(replies.find((r) => r._id === selectedReplyId))
          }
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedReplyId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Reply</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reply? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GroupDiscussionPage;
