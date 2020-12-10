class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable
  include DeviseTokenAuth::Concerns::User

  mount_uploader :profile, ImageUploader

  has_many :records, dependent: :destroy
  has_many :relationships, dependent: :destroy
  has_many :followings, through: :relationships, source: :follow
  has_many :reverse_of_relationships, class_name: 'Relationship', foreign_key: 'follow_id', dependent: :destroy
  has_many :followers, through: :reverse_of_relationships, source: :user

  validates :name, presence: true, length: { maximum: 20 }
  validates :email,
            presence: true,
            length: { maximum: 256 },
            uniqueness: true,
            format: { with: /\A[\w+.-]+@[a-z\d.-]+\.[a-z]+\z/i }
  validates :password,
            presence: true, on: :create,
            length: { minimum: 6 },
            format: { with: /\A[\w-]+\z/ },
            confirmation: true
  validates :theme, presence: true, inclusion: { in: %w[light dark] }
end
