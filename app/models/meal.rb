class Meal < ApplicationRecord
  mount_uploader :image, ImageUploader

  belongs_to :record

  validates :meal_type, presence: true, inclusion: { in: %w[breakfast lunch dinner snack] }
  validates :record, presence: true
end
