class Record < ApplicationRecord
  belongs_to :user
  has_one :memo, dependent: :destroy
  has_many :appearances, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liking_users, through: :likes, source: :user

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
end
