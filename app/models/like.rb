class Like < ApplicationRecord
  belongs_to :user
  belongs_to :record

  validates :user, presence: true
  validates :record, presence: true
end
