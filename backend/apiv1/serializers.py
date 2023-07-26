from rest_framework import serializers

from shop.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "price", "created_at"]
        read_only_fields = ["created_at"]
