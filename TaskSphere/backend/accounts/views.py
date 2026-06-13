from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully.",
                    "user": {
                        "username": user.username,
                        "email": user.email
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
