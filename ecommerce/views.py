from django.shortcuts import render

# Create your views here.
def index(request):
    hello = "hello"

    context = {hello: 'hello'}
    return render (request, 'ecommerce/index.html', context) 
