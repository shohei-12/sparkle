class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable
  include DeviseTokenAuth::Concerns::User

  mount_uploader :profile, ImageUploader

  has_many :records, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
  validates :email,
            presence: true,
            length: { maximum: 256 },
            uniqueness: true,
            format: { with: /\A[\w+.-]+@[a-z\d.-]+\.[a-z]+\z/i }
  validates :password,
            presence: true, on: :create,
            length: { minimum: 6 },
            format: { with: /\A[\w-]+\z/ }
  validates_confirmation_of :password
end
