# eating_times
EatingTime.create!([
                     { name: 'breakfast' },
                     { name: 'lunch' },
                     { name: 'dinner' },
                     { name: 'snack' }
                   ])

# guest user
User.create!(
  profile: open("#{Rails.root}/db/fixtures/guest-profile.jpg"),
  name: 'ゲスト',
  email: 'guest@example.com',
  password: 'password',
  password_confirmation: 'password',
  theme: 'light'
)

# sub user
4.times do |n|
  User.create!(
    name: Faker::Name.unique.name,
    email: "sub#{n + 1}@example.com",
    password: 'password',
    password_confirmation: 'password',
    theme: 'light'
  )
end

# records
head = Date.new(2021, 1, 1)
tail = Date.new(2021, 2, 28)
(head..tail).each do |d|
  [1, 2, 3, 4, 5].each do |n|
    Record.create!(
      date: d,
      appearance: open("#{Rails.root}/db/fixtures/appearances/appearance#{rand(1..5)}.jpg"),
      user_id: n
    )
  end
end

# memos
295.times do |n|
  Memo.create!(
    appearance: '見た目についてメモを残せます。',
    breakfast: '朝食についてメモを残せます。',
    lunch: '昼食についてメモを残せます。',
    dinner: '夕食についてメモを残せます。',
    snack: '間食についてメモを残せます。',
    record_id: n + 1
  )
end

# appearances
295.times do |i|
  rand(0..5).times do |n|
    Appearance.create!(
      image: open("#{Rails.root}/db/fixtures/appearances/appearance#{n + 1}.jpg"),
      record_id: i + 1
    )
  end
end

# mealss
295.times do |i|
  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/breakfasts/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/lunchs/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 2
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/dinners/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 3
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/snacks/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 4
    )
  end
end
