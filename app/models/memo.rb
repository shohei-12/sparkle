class Memo < ApplicationRecord
  belongs_to :record

  validates :record, presence: true, uniqueness: true
end
