class Api::V1::CommentsController < ApplicationController
  before_action :set_comment, only: %i[ten_reply_comments destroy]

  def create
    comment = current_api_v1_user.comments.create(comment_pramas)
    comment_info = Comment.get_comment_infos([comment])
    render json: comment_info
  end

  def twenty_comments
    twenty_comments = Comment.where(record_id: params[:record_id],
                                    target: params[:target],
                                    reply_comment_id: nil)
                             .order(created_at: 'DESC')
                             .limit(20)
                             .offset(params[:start])
    comment_infos = Comment.get_comment_infos(twenty_comments)
    render json: comment_infos
  end

  def ten_reply_comments
    ten_reply_comments = Comment.where(reply_comment_id: @comment.id)
                                .limit(10)
                                .offset(params[:start])
    comment_infos = Comment.get_comment_infos(ten_reply_comments)
    render json: comment_infos
  end

  def destroy
    @comment.destroy if @comment.user_id == current_api_v1_user.id
  end

  private

  def comment_pramas
    params.require(:comment).permit(
      :record_id,
      :target,
      :content,
      :reply_comment_id,
      :reply_user_id
    )
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end
end
