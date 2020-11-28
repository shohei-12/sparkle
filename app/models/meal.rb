class Meal < ApplicationRecord
  mount_uploader :image, ImageUploader

  belongs_to :record
  belongs_to :eating_time

  validates :record, presence: true
  validates :eating_time, presence: true
end
