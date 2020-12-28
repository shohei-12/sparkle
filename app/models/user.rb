class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable
  include DeviseTokenAuth::Concerns::User

  mount_uploader :profile, ImageUploader

  has_many :records, dependent: :destroy
  has_many :relationships, dependent: :destroy
  has_many :followings, through: :relationships, source: :follow
  has_many :reverse_of_relationships, class_name: 'Relationship', foreign_key: 'follow_id', dependent: :destroy
  has_many :followers, through: :reverse_of_relationships, source: :user
  has_many :likes, dependent: :destroy
  has_many :like_records, through: :likes, source: :record

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

  def follow(other_user)
    relationships.create(follow_id: other_user.id) unless self == other_user
  end

  def unfollow(other_user)
    relationship = relationships.find_by(follow_id: other_user.id)
    relationship&.destroy
  end

  def following?(other_user)
    followings.include?(other_user)
  end

  def self.get_followings(user_followings, current_user)
    followings = []
    user_followings.each do |following|
      bool = current_user.following?(following)
      followings.push({
                        id: following.id,
                        name: following.name,
                        profile: following.profile,
                        following: bool
                      })
    end
    followings
  end

  def self.get_followers(user_followers, current_user)
    followers = []
    user_followers.each do |follower|
      bool = current_user.following?(follower)
      followers.push({
                       id: follower.id,
                       name: follower.name,
                       profile: follower.profile,
                       following: bool
                     })
    end
    followers
  end

  def like(record)
    likes.create(record_id: record.id)
  end

  def unlike(record)
    like = likes.find_by(record_id: record.id)
    like&.destroy
  end
end
