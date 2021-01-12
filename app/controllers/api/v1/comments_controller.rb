class Api::V1::CommentsController < ApplicationController
  def create
    comment = current_api_v1_user.comments.create(comment_pramas)
    render json: comment
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
