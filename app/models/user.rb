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
  has_many :comments, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
  validates :email,
            presence: true,
            length: { maximum: 256 },
            uniqueness: true,
            format: { with: /\A[\w+.-]+@[a-z\d.-]+\.[a-z]+\z/i }
  validates :self_introduction, length: { maximum: 160 }
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

  def self.get_following_infos(user_followings, current_user)
    following_infos = []
    user_followings.each do |following|
      bool = current_user.following?(following)
      following_infos.push({
                             id: following.id,
                             name: following.name,
                             profile: following.profile,
                             following: bool
                           })
    end
    following_infos
  end

  def self.get_follower_infos(user_followers, current_user)
    follower_infos = []
    user_followers.each do |follower|
      bool = current_user.following?(follower)
      follower_infos.push({
                            id: follower.id,
                            name: follower.name,
                            profile: follower.profile,
                            following: bool
                          })
    end
    follower_infos
  end

  def like(record)
    likes.create(record_id: record.id)
  end

  def unlike(record)
    like = likes.find_by(record_id: record.id)
    like&.destroy
  end
end
