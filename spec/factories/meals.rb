FactoryBot.define do
  factory :meal do
    image { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }
    time { '2020-11-22 15:18:23' }
    association :record
    association :eating_time
  end
end
