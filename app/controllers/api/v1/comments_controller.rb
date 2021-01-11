class Api::V1::CommentsController < ApplicationController
  def create
    comment = current_api_v1_user.comments.create(
      record_id: params[:recordId],
      target: params[:target],
      content: params[:content],
      reply_comment_id: params[:replyCommentId],
      reply_user_id: params[:replyUserId]
    )
    render json: comment
  end
end
