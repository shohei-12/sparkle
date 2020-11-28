class Record < ApplicationRecord
  belongs_to :user
  has_many :appearances, dependent: :destroy
  has_many :meals, dependent: :destroy

  validates :date, presence: true
  validates :user, presence: true
end
