class Appearance < ApplicationRecord
  mount_uploader :image, ImageUploader

  belongs_to :record

  validates :record, presence: true
end
