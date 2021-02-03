class Record < ApplicationRecord
  belongs_to :user
  has_one :memo, dependent: :destroy
  has_many :appearances, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liking_users, through: :likes, source: :user
  has_many :comments, dependent: :destroy

  validates :date, presence: true
  validates :user, presence: true, uniqueness: { scope: :date }

  def liked_by?(current_user)
    liking_users.include?(current_user)
  end

  def self.get_record_infos(records, current_user)
    record_infos = []
    records.each do |record|
      record_infos.push({
                          record_id: record.id,
                          date: record.date,
                          appearance: record.appearances.first,
                          profile: record.user.profile,
                          author: record.user.name,
                          author_id: record.user_id,
                          likes: record.likes.length,
                          liking: record.liked_by?(current_user)
                        })
    end
    record_infos
  end

  def self.slice_images(images)
    container = []
    images.each do |i|
      container.push([i.id, i.image.url])
    end
    container
  end

  def self.delete_images(appearances, meals, current_user_id)
    appearances.each do |i|
      appearance = Appearance.find(i)
      user_id = appearance.record.user_id
      appearance.destroy if user_id == current_user_id
    end
    meals.each do |i|
      meal = Meal.find(i)
      user_id = meal.record.user_id
      meal.destroy if user_id == current_user_id
    end
  end

  def get_comment_count
    {
      appearance: comments.where(target: 'appearance').length,
      breakfast: comments.where(target: 'breakfast').length,
      lunch: comments.where(target: 'lunch').length,
      dinner: comments.where(target: 'dinner').length,
      snack: comments.where(target: 'snack').length
    }
  end
end
