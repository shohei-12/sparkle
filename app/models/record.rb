class Record < ApplicationRecord
  belongs_to :user

  has_many :appearances, dependent: :destroy
end
