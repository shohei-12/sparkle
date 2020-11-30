FactoryBot.define do
  factory :meal do
    image { 'test.png' }
    time { '2020-11-22 15:18:23' }
    association :record
    association :eating_time
  end
end
