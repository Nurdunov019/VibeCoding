from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    is_admin: bool

    class Config:
        from_attributes = True


class ComplexOut(BaseModel):
    id: int
    name: str
    slug: str
    developer: Optional[str] = None
    address: str
    city: str
    region: str = "bishkek"
    status: str
    completion_quarter: Optional[str] = None
    completion_year: Optional[int] = None
    price_per_sqm_usd: Optional[float] = None
    price_per_sqm_kgs: Optional[float] = None
    class_type: Optional[str] = None
    floors: Optional[int] = None
    buildings_count: int
    apartments_count: Optional[int] = None
    verification_score: int
    verification_status: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True


class ComplexCreate(BaseModel):
    name: str
    slug: str
    developer: Optional[str] = None
    address: str
    city: str = "Бишкек"
    region: str = "bishkek"
    status: str = "building"
    completion_quarter: Optional[str] = None
    completion_year: Optional[int] = None
    price_per_sqm_usd: Optional[float] = None
    price_per_sqm_kgs: Optional[float] = None
    class_type: Optional[str] = None
    floors: Optional[int] = None
    buildings_count: int = 1
    apartments_count: Optional[int] = None
    verification_score: int = 0
    verification_status: str = "partial"
    image_url: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ComplexUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    developer: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    status: Optional[str] = None
    completion_quarter: Optional[str] = None
    completion_year: Optional[int] = None
    price_per_sqm_usd: Optional[float] = None
    price_per_sqm_kgs: Optional[float] = None
    class_type: Optional[str] = None
    floors: Optional[int] = None
    buildings_count: Optional[int] = None
    apartments_count: Optional[int] = None
    verification_score: Optional[int] = None
    verification_status: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class MapMarker(BaseModel):
    id: int
    name: str
    slug: str
    address: str
    latitude: float
    longitude: float
    price_per_sqm_usd: Optional[float] = None
    verification_score: int
    verification_status: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class CompareRequest(BaseModel):
    slugs: List[str] = Field(min_length=2, max_length=4)


class CompareItem(BaseModel):
    complex: ComplexOut
    documents_valid: int
    documents_missing: int
    documents_total: int


class DocumentOut(BaseModel):
    id: int
    complex_id: int
    doc_type: str
    title: str
    number: Optional[str] = None
    issued_by: Optional[str] = None
    issued_date: Optional[str] = None
    expiry_date: Optional[str] = None
    status: str
    file_url: Optional[str] = None
    is_public: bool
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class DocumentCreate(BaseModel):
    doc_type: str
    title: str
    number: Optional[str] = None
    issued_by: Optional[str] = None
    issued_date: Optional[str] = None
    expiry_date: Optional[str] = None
    status: str = "valid"
    file_url: Optional[str] = None
    is_public: bool = True
    notes: Optional[str] = None


class DocumentUpdate(BaseModel):
    doc_type: Optional[str] = None
    title: Optional[str] = None
    number: Optional[str] = None
    issued_by: Optional[str] = None
    issued_date: Optional[str] = None
    expiry_date: Optional[str] = None
    status: Optional[str] = None
    file_url: Optional[str] = None
    is_public: Optional[bool] = None
    notes: Optional[str] = None


class VerificationResult(BaseModel):
    complex_id: int
    complex_name: str
    score: int
    status: str
    total_documents: int
    valid_documents: int
    missing_documents: int
    expired_documents: int
    checks: List[dict]


class RequestLegalAccess(BaseModel):
    email: EmailStr
    days: int = Field(default=3, ge=1, le=4)


class LegalAccessOut(BaseModel):
    access_token: str
    expires_at: datetime
    view_url: str
    message: str


class LegalReportView(BaseModel):
    title: str
    summary: Optional[str] = None
    conclusion: str
    risk_level: str
    prepared_at: Optional[str] = None
    complex_name: str
    expires_at: datetime
    views_left: int
    watermark: str
    pdf_url: Optional[str] = None
