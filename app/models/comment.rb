class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :record

  validates :user, presence: true
  validates :record, presence: true
  validates :target, presence: true, inclusion: { in: %w[appearance breakfast lunch dinner snack] }
end
