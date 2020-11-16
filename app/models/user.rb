class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable
  include DeviseTokenAuth::Concerns::User

  validates :name, presence: true, length: { maximum: 20 }
  validates :email,
            presence: true,
            length: { maximum: 256 },
            uniqueness: true,
            format: { with: /\A[\w+.-]+@[a-z\d.-]+\.[a-z]+\z/i }
  validates :password,
            presence: true,
            length: { minimum: 6 },
            format: { with: /\A[\w-]+\z/ },
            on: :create
  validates_confirmation_of :password
end
