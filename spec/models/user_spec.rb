require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user1) { build(:user) }
  let(:user2) { create(:user) }
  let(:user3) { create(:user) }
  let(:user4) { create(:user) }
  let(:record) { create(:record) }

  it 'return true' do
    expect(user1.valid?).to eq true
  end

  describe 'name' do
    context 'when empty' do
      before { user1.name = '' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when over 20 characters' do
      before { user1.name = 'a' * 21 }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end
  end

  describe 'email' do
    context 'when empty' do
      before { user1.email = '' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when over 256 characters' do
      before { user1.email = "#{'a' * 245}@example.com" }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when duplication' do
      before { user1.email = user2.email }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when format is incorrect' do
      it 'return false' do
        [
          'a_B6.@@ac8.com',
          'YSujfa.net',
          'gh+o-@ac:.jp',
          'ty@rrvb',
          'ewL@ki.net6',
          'vlae@fa.'
        ].each do |invalid_email|
          user1.email = invalid_email
          expect(user1.valid?).to eq false
        end
      end
    end
  end

  describe 'self_introduction' do
    context 'when over 160 characters' do
      before { user1.self_introduction = 'a' * 161 }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end
  end

  describe 'password' do
    context 'when empty' do
      before do
        user1.password = ''
        user1.password_confirmation = ''
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when less than 6 characters' do
      before do
        user1.password = 'a' * 5
        user1.password_confirmation = 'a' * 5
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when not match with confirmation password' do
      before do
        user1.password = 'passwor'
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when format is incorrect' do
      it 'return false' do
        [
          'ajlV9@',
          '+98_g-T',
          'gal^e3'
        ].each do |invalid_password|
          user1.password = invalid_password
          user1.password_confirmation = invalid_password
          expect(user1.valid?).to eq false
        end
      end
    end
  end

  describe 'theme' do
    context 'when empty' do
      before { user1.theme = '' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when not a specific value' do
      before { user1.theme = 'lightt' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end
  end

  describe '#follow(other_user)' do
    context 'when other_user exists' do
      context 'when other_user is not self' do
        context 'when not following other_user' do
          it 'follow other_user' do
            expect { user2.follow(user3) }.to change(Relationship, :count).by(1)
            relationship = Relationship.first
            expect(relationship.user_id).to eq user2.id
            expect(relationship.follow_id).to eq user3.id
          end
        end

        context 'when already following other_user' do
          before { user2.follow(user3) }

          it 'not follow other_user' do
            expect { user2.follow(user3) }.to change(Relationship, :count).by(0)
          end
        end
      end

      context 'when other_user is self' do
        it 'not follow other_user' do
          expect { user2.follow(user2) }.to change(Relationship, :count).by(0)
        end
      end
    end

    context 'when other_user does not exist' do
      it 'raise NoMethodError' do
        expect { user2.follow(nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#unfollow(other_user)' do
    context 'when following other_user' do
      before { user2.follow(user3) }

      it 'unfollow other_user' do
        expect { user2.unfollow(user3) }.to change(Relationship, :count).by(-1)
      end
    end

    context 'when not following other_user' do
      it 'return nil' do
        expect(user2.unfollow(user4)).to eq nil
      end
    end

    context 'when other_user does not exist' do
      it 'raise NoMethodError' do
        expect { user2.unfollow(nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#following?(other_user)' do
    context 'when following other_user' do
      before { user2.follow(user3) }

      it 'return true' do
        expect(user2.following?(user3)).to eq true
      end
    end

    context 'when not following other_user' do
      it 'return false' do
        expect(user2.following?(user3)).to eq false
      end
    end
  end

  describe '#self.get_following_infos(user_followings, current_user)' do
    context 'when followings exists' do
      it 'get following infos' do
        following_infos = described_class.get_following_infos([user3, user4], user2)
        user3_info = { user: user3, index: 0 }
        user4_info = { user: user4, index: 1 }
        [user3_info, user4_info].each do |user_info|
          expect(following_infos[user_info[:index]][:id]).to eq user_info[:user].id
          expect(following_infos[user_info[:index]][:name]).to eq user_info[:user].name
          expect(following_infos[user_info[:index]][:profile]).to eq user_info[:user].profile
          expect(following_infos[user_info[:index]][:following]).to eq user2.following?(user_info[:user])
        end
      end
    end

    context 'when followings does not exist' do
      it 'not get following infos' do
        following_infos = described_class.get_following_infos([], user2)
        expect(following_infos.length).to eq 0
      end
    end

    context 'when current user does not exist' do
      context 'when followings exists' do
        it 'raise NoMethodError' do
          expect { described_class.get_following_infos([user2, user3], nil) }.to raise_error(NoMethodError)
        end
      end

      context 'when followings does not exist' do
        it 'not get following infos' do
          following_infos = described_class.get_following_infos([], nil)
          expect(following_infos.length).to eq 0
        end
      end
    end
  end

  describe '#self.get_follower_infos(user_followers, current_user)' do
    context 'when followers exists' do
      it 'get follower infos' do
        follower_infos = described_class.get_follower_infos([user3, user4], user2)
        user3_info = { user: user3, index: 0 }
        user4_info = { user: user4, index: 1 }
        [user3_info, user4_info].each do |user_info|
          expect(follower_infos[user_info[:index]][:id]).to eq user_info[:user].id
          expect(follower_infos[user_info[:index]][:name]).to eq user_info[:user].name
          expect(follower_infos[user_info[:index]][:profile]).to eq user_info[:user].profile
          expect(follower_infos[user_info[:index]][:following]).to eq user2.following?(user_info[:user])
        end
      end
    end

    context 'when followers does not exist' do
      it 'not get follower infos' do
        follower_infos = described_class.get_follower_infos([], user2)
        expect(follower_infos.length).to eq 0
      end
    end

    context 'when current user does not exist' do
      context 'when followers exists' do
        it 'raise NoMethodError' do
          expect { described_class.get_follower_infos([user2, user3], nil) }.to raise_error(NoMethodError)
        end
      end

      context 'when followers does not exist' do
        it 'not get follower infos' do
          follower_infos = described_class.get_follower_infos([], nil)
          expect(follower_infos.length).to eq 0
        end
      end
    end
  end

  describe '#like(record)' do
    context 'when record exists' do
      it 'like record' do
        expect { user2.like(record) }.to change(Like, :count).by(1)
        like = Like.first
        expect(like.user_id).to eq user2.id
        expect(like.record_id).to eq record.id
      end
    end

    context 'when already liking' do
      before { user2.like(record) }

      it 'not like record' do
        expect { user2.like(record) }.to change(Like, :count).by(0)
      end
    end

    context 'when record does not exist' do
      it 'raise NoMethodError' do
        expect { user2.like(nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#unlike(record)' do
    context 'when liking' do
      before { user2.like(record) }

      it 'unlike record' do
        expect { user2.unlike(record) }.to change(Like, :count).by(-1)
      end
    end

    context 'when not liking' do
      it 'return nil' do
        expect(user2.unlike(record)).to eq nil
      end
    end

    context 'when record does not exist' do
      it 'raise NoMethodError' do
        expect { user2.unlike(nil) }.to raise_error(NoMethodError)
      end
    end
  end
end
