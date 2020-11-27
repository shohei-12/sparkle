class EatingTime < ApplicationRecord
  has_many :meals, dependent: :destroy
end
