from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Complex(Base):
    __tablename__ = "complexes"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    developer = Column(String, nullable=True)
    address = Column(String, nullable=False)
    city = Column(String, default="Бишкек")
    region = Column(String, default="bishkek", index=True)
    status = Column(String, default="building")  # building, commissioned, planned
    completion_quarter = Column(String, nullable=True)
    completion_year = Column(Integer, nullable=True)
    price_per_sqm_usd = Column(Float, nullable=True)
    price_per_sqm_kgs = Column(Float, nullable=True)
    class_type = Column(String, nullable=True)  # economy, comfort, business, premium
    floors = Column(Integer, nullable=True)
    buildings_count = Column(Integer, default=1)
    apartments_count = Column(Integer, nullable=True)
    verification_score = Column(Integer, default=0)  # 0-100
    verification_status = Column(String, default="partial")  # verified, partial, unverified, risk
    image_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="complex", cascade="all, delete-orphan")
    legal_reports = relationship("LegalReport", back_populates="complex", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    complex_id = Column(Integer, ForeignKey("complexes.id"), nullable=False)
    doc_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    number = Column(String, nullable=True)
    issued_by = Column(String, nullable=True)
    issued_date = Column(String, nullable=True)
    expiry_date = Column(String, nullable=True)
    status = Column(String, default="valid")  # valid, expired, missing, pending
    file_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complex = relationship("Complex", back_populates="documents")


class LegalReport(Base):
    __tablename__ = "legal_reports"

    id = Column(Integer, primary_key=True)
    complex_id = Column(Integer, ForeignKey("complexes.id"), nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    conclusion = Column(Text, nullable=False)
    risk_level = Column(String, default="medium")  # low, medium, high
    file_path = Column(String, nullable=True)
    prepared_at = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complex = relationship("Complex", back_populates="legal_reports")
    access_grants = relationship("ReportAccess", back_populates="report", cascade="all, delete-orphan")


class ReportAccess(Base):
    __tablename__ = "report_access"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("legal_reports.id"), nullable=False)
    user_email = Column(String, nullable=False)
    access_token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    views_count = Column(Integer, default=0)
    max_views = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("LegalReport", back_populates="access_grants")
