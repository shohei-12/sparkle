class Relationship < ApplicationRecord
  belongs_to :user
  belongs_to :follow, class_name: 'User'

  validates :user, presence: true, uniqueness: { scope: :follow }
  validates :follow, presence: true
end
