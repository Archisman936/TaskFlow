from sqlalchemy.orm import Session
from app.models.user import User
from app.services.auth_service import get_password_hash

ADMIN_ACCOUNTS = [
    {
        "username": "admin1",
        "email": "admin1@taskflow.com",
        "password": "Admin@1234",
    },
    {
        "username": "admin2",
        "email": "admin2@taskflow.com",
        "password": "Admin@5678",
    },
    {
        "username": "admin3",
        "email": "admin3@taskflow.com",
        "password": "Admin@9012",
    },
    {
        "username": "admin4",
        "email": "admin4@taskflow.com",
        "password": "Admin@3456",
    },
    {
        "username": "admin5",
        "email": "admin5@taskflow.com",
        "password": "Admin@7890",
    },
]


def seed_admin_users(db: Session) -> None:
    created_count = 0

    for admin in ADMIN_ACCOUNTS:
        existing = db.query(User).filter(User.username == admin["username"]).first()
        if existing:
            if existing.role != "admin":
                existing.role = "admin"
                db.commit()
            continue

        db_user = User(
            username=admin["username"],
            email=admin["email"],
            hashed_password=get_password_hash(admin["password"]),
            role="admin",
            is_active=True,
        )
        db.add(db_user)
        created_count += 1

    if created_count > 0:
        db.commit()
