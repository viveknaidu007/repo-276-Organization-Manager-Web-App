from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationOut, OrganizationUpdate
from app.services.auth import get_current_user, AuthUser
from sqlalchemy import select
import uuid

router = APIRouter(prefix="/organizations", tags=["organizations"])

@router.get("/", response_model=List[OrganizationOut])
def list_organizations(current_user: AuthUser = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = select(Organization).where(Organization.owner_id == current_user.id).order_by(Organization.created_at.desc())
    items = db.execute(stmt).scalars().all()
    return items

@router.post("/", response_model=OrganizationOut, status_code=status.HTTP_201_CREATED)
def create_organization(payload: OrganizationCreate, current_user: AuthUser = Depends(get_current_user), db: Session = Depends(get_db)):
    org = Organization(name=payload.name, description=payload.description, owner_id=current_user.id)
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

@router.get("/{org_id}", response_model=OrganizationOut)
def get_organization(org_id: str, current_user: AuthUser = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        org_uuid = uuid.UUID(org_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    org = db.get(Organization, org_uuid)
    if not org or org.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org

@router.put("/{org_id}", response_model=OrganizationOut)
@router.patch("/{org_id}", response_model=OrganizationOut)
def update_organization(org_id: str, payload: OrganizationUpdate, current_user: AuthUser = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        org_uuid = uuid.UUID(org_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    org = db.get(Organization, org_uuid)
    if not org or org.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    if payload.name is not None:
        org.name = payload.name
    if payload.description is not None:
        org.description = payload.description
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(org_id: str, current_user: AuthUser = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        org_uuid = uuid.UUID(org_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    org = db.get(Organization, org_uuid)
    if not org or org.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    db.delete(org)
    db.commit()
    return None
