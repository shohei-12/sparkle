class Record < ApplicationRecord
  belongs_to :user
  has_one :memo, dependent: :destroy
  has_many :appearances, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :users, through: :likes

  validates :date, presence: true
  validates :user, presence: true, uniqueness: { scope: :date }
end
