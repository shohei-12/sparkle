class Api::V1::CommentsController < ApplicationController
  def create
    comment = current_api_v1_user.comments.create(comment_pramas)
    comment_info = Comment.get_comment_infos([comment])
    render json: comment_info
  end

  def twenty_comments
    twenty_comments = Comment.where(record_id: params[:record_id], target: params[:target])
                             .order(created_at: 'DESC')
                             .limit(20)
                             .offset(params[:start])
    comment_infos = Comment.get_comment_infos(twenty_comments)
    render json: comment_infos
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
end
