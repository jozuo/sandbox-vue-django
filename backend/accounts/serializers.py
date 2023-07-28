from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

UserModel = get_user_model()


class LoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True, allow_blank=False)


class UserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        model = UserModel
        fields = ("id", "email", "nickname")
        read_only_fields = ("email",)
