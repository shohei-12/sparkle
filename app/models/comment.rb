class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :record

  validates :user, presence: true
  validates :record, presence: true
  validates :target, presence: true, inclusion: { in: %w[appearance breakfast lunch dinner snack] }
  validates :content, presence: true

  def self.get_comment_infos(comments)
    comment_infos = []
    comments.each do |comment|
      str = comment.created_at.strftime('%Y-%m-%d')
      reply_count = Comment.where(reply_comment_id: comment.id).length
      reply_user_id = comment.reply_user_id
      reply_user_name = reply_user_id ? User.find(reply_user_id).name : nil
      comment_infos.push({
                           comment_id: comment.id,
                           author_id: comment.user_id,
                           author_profile: comment.user.profile,
                           author_name: comment.user.name,
                           content: comment.content,
                           created_at: str,
                           reply_count: reply_count,
                           reply_user_id: reply_user_id,
                           reply_user_name: reply_user_name
                         })
    end
    comment_infos
  end
end
