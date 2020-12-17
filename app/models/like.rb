class Like < ApplicationRecord
  belongs_to :user
  belongs_to :record

  validates :user, presence: true, uniqueness: { scope: :record }
  validates :record, presence: true
end
