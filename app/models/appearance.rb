class Appearance < ApplicationRecord
  mount_uploader :image, AppearanceUploader

  belongs_to :record
end
