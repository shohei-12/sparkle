require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:record) { create(:record) }
  let(:token) { sign_in({ email: user1.email, password: 'password' }) }
  let(:start0) do
    { start: 0 }
  end
  let(:start20) do
    { start: 20 }
  end

  describe 'GET /api/v1/users/:id' do
    context 'when user exists' do
      it 'get user' do
        user1.follow(user2)
        user2.follow(user1)
        user1.like(record)
        get_user(user1.id)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['user']['id']).to eq user1.id
        expect(JSON.parse(response.body)['followings']).to eq 1
        expect(JSON.parse(response.body)['followers']).to eq 1
        expect(JSON.parse(response.body)['likes']).to eq 1
      end
    end

    context 'when user does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_user(user1.id += 1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/toggle-theme' do
    context 'when token is valid' do
      before do
        @user = create(:user)
        @token = sign_in({ email: @user.email, password: 'password' })
      end

      it 'toggle theme' do
        expect(@user.theme).to eq 'light'
        toggle_theme({ theme: 'dark' }, @token)
        expect(response.status).to eq 204
        expect(@user.reload.theme).to eq 'dark'
      end
    end

    context 'when token is invalid' do
      it 'raise NoMethodError' do
        expect { toggle_theme({ theme: 'dark' }, nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe 'GET /api/v1/users/:id/followings' do
    context 'when current user exists' do
      context 'when user exists' do
        context 'when there are more than 20 followings' do
          before do
            21.times do
              user = create(:user)
              user1.follow(user)
            end
          end

          it 'get 20 followings' do
            get_20_followings(user1.id, start0, token)
            expect(response.status).to eq 200
            expect(JSON.parse(response.body).length).to eq 20
          end

          it 'get 1 following' do
            get_20_followings(user1.id, start20, token)
            expect(response.status).to eq 200
            expect(JSON.parse(response.body).length).to eq 1
          end
        end

        context 'when there are less than 20 followings' do
          context 'when there are more than 1 following' do
            before do
              2.times do
                user = create(:user)
                user1.follow(user)
              end
            end

            it 'get 2 followings' do
              get_20_followings(user1.id, start0, token)
              expect(response.status).to eq 200
              expect(JSON.parse(response.body).length).to eq 2
            end

            it 'not get followings' do
              get_20_followings(user1.id, start20, token)
              expect(response.status).to eq 200
              expect(JSON.parse(response.body).length).to eq 0
            end
          end

          context 'when when followings does not exist' do
            it 'not get followings' do
              get_20_followings(user1.id, start0, token)
              expect(response.status).to eq 200
              expect(JSON.parse(response.body).length).to eq 0
            end
          end
        end
      end

      context 'when user does not exist' do
        it 'raise ActiveRecord::RecordNotFound' do
          expect { get_20_followings(user1.id + 1, start0, token) }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end

    context 'when current user does not exist' do
      context 'when followings exists' do
        before { user1.follow(user2) }

        it 'raise NoMethodError' do
          expect { get_20_followings(user1.id, start0, nil) }.to raise_error(NoMethodError)
        end
      end

      context 'when followings does not exist' do
        it 'not get followings' do
          get_20_followings(user1.id, start0, nil)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 0
        end
      end
    end
  end

  describe 'GET /api/v1/users/:id/followers' do
    context 'when current user exists' do
      context 'when user exists' do
        context 'when there are more than 20 followers' do
          before do
            21.times do
              user = create(:user)
              user.follow(user1)
            end
          end

          it 'get 20 followers' do
            get_20_followers(user1.id, start0, token)
            expect(response.status).to eq 200
            expect(JSON.parse(response.body).length).to eq 20
          end

          it 'get 1 follower' do
            get_20_followers(user1.id, start20, token)
            expect(response.status).to eq 200
            expect(JSON.parse(response.body).length).to eq 1
          end
        end

        context 'when there are less than 20 followers' do
          context 'when there are more than 1 follower' do
            before do
              2.times do
                user = create(:user)
                user.follow(user1)
              end
            end

            it 'get 2 followers' do
              get_20_followers(user1.id, start0, token)
              expect(response.status).to eq 200
              expect(JSON.parse(response.body).length).to eq 2
            end

            it 'not get followers' do
              get_20_followers(user1.id, start20, token)
              expect(response.status).to eq 200
              expect(JSON.parse(response.body).length).to eq 0
            end
          end

          context 'when when followers does not exist' do
            it 'not get followers' do
              get_20_followers(user1.id, start0, token)
              expect(response.status).to eq 200
              expect(JSON.parse(response.body).length).to eq 0
            end
          end
        end
      end

      context 'when user does not exist' do
        it 'raise ActiveRecord::RecordNotFound' do
          expect { get_20_followers(user1.id + 1, start0, token) }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end

    context 'when current user does not exist' do
      context 'when followers exists' do
        before { user2.follow(user1) }

        it 'raise NoMethodError' do
          expect { get_20_followers(user1.id, start0, nil) }.to raise_error(NoMethodError)
        end
      end

      context 'when followers does not exist' do
        it 'not get followers' do
          get_20_followers(user1.id, start0, nil)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 0
        end
      end
    end
  end
end
