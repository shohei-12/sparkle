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
      comment_infos.push({
                           comment_id: comment.id,
                           author_id: comment.user_id,
                           author_profile: comment.user.profile,
                           author_name: comment.user.name,
                           content: comment.content,
                           created_at: str
                         })
    end
    comment_infos
  end
end
