class Record < ApplicationRecord
  belongs_to :user
  has_one :memo, dependent: :destroy
  has_many :appearances, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liking_users, through: :likes, source: :user

  validates :date, presence: true
  validates :user, presence: true, uniqueness: { scope: :date }

  def liked_by?(current_user)
    liking_users.include?(current_user)
  end
end
