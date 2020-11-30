FactoryBot.define do
  factory :record do
    date { '2020-11-22' }
    association :user
  end
end
