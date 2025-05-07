from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('', views.index, name='index'),
    path('orders/', views.orders, name='orders'),
    path('orders/create/', views.order_create, name='order_create'),
    path('orders/<int:order_id>/', views.order_detail, name='order_detail'),
    path('orders/<int:order_id>/edit/', views.order_edit, name='order_edit'),
    path('orders/<int:order_id>/delete/', views.order_delete, name='order_delete'),
    path('drivers/', views.drivers, name='drivers'),
    path('drivers/<int:driver_id>/', views.driver_detail, name='driver_detail'),
    path('drivers/<int:driver_id>/edit/', views.driver_edit, name='driver_edit'),
    path('drivers/<int:driver_id>/delete/', views.driver_delete, name='driver_delete'),
    path('customers/', views.customers, name='customers'),
    path('customers/<int:customer_id>/', views.customer_detail, name='customer_detail'),
    path('customers/<int:customer_id>/edit/', views.customer_edit, name='customer_edit'),
    path('customers/<int:customer_id>/delete/', views.customer_delete, name='customer_delete'),
    path('vehicles/', views.vehicles, name='vehicles'),
    path('vehicles/create/', views.vehicle_create, name='vehicle_create'),
    path('vehicles/<int:vehicle_id>/', views.vehicle_detail, name='vehicle_detail'),
    path('vehicles/<int:vehicle_id>/edit/', views.vehicle_edit, name='vehicle_edit'),
    path('vehicles/<int:vehicle_id>/delete/', views.vehicle_delete, name='vehicle_delete'),
] 