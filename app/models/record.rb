class Record < ApplicationRecord
  mount_uploader :appearance, ImageUploader

  belongs_to :user
  has_one :memo, dependent: :destroy
  has_many :appearances, dependent: :destroy
  has_many :meals, dependent: :destroy

  validates :date, presence: true
  validates :user, presence: true, uniqueness: { scope: :date }
end
