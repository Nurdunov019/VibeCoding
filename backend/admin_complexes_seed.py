"""Admin-added residential complexes — persisted for production deploys."""

LEGACY_DUPLICATE_SLUGS = frozenset({
    "«Кап Строй Кей Джи»",
    "Елизавета",
    "Жаннат Билдинг",
    "Эласс Строй",
    "Артвин Девелопмент",
    "Кап Строй Кей Джи",
    "Левел Констракшн",
})

ADMIN_COMPLEXES = [
    {
        "name": "Jannat Tower",
        "slug": "jannat-tower",
        "address": "Бишкек, Первомайский р-н, по ул. Логвиненко, д. 3г.",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "3 кв.",
        "completion_year": 2027,
        "price_per_sqm_usd": 1700.0,
        "price_per_sqm_kgs": 148667.0,
        "class_type": "premium",
        "floors": "14",
        "buildings_count": 1,
        "apartments_count": 75,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/jannat-tower.jpg",
        "features": (
            "Расположение в «Золотом квадрате» в самом центре Бишкека. "
            "Клубный формат дома всего на 75 квартир. "
            "Премиальный фасад из натурального гранита. "
            "Закрытая территория с охраной 24/7. Подземный паркинг."
        ),
        "entrances_count": 1,
        "initial_payment_percent": 30.0,
        "installment_months": 15,
        "has_red_book": True,
        "description": (
            "Формат: 1 блок, 1 подъезд, всего 75 квартир. "
            "Фасад из натурального гранита, монолитный каркас."
        ),
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/jannat-tower-legal.docx",
    },
    {
        "name": "LEVAN PARK",
        "slug": "levan-park",
        "address": "Бишкек, Октябрьский р-н, ул. Институт сейсмостойкости строительства-1 (ж/м ИСС), д. 4; д. 2; д. 1а",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "4 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1700.0,
        "price_per_sqm_kgs": 148665.0,
        "class_type": "premium",
        "floors": "От 4 до 12 этажей",
        "buildings_count": 17,
        "apartments_count": 100,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/levan-park.jpg",
        "features": (
            "Премиальный статус локации в районе АУЦА. "
            "Монолитно-кирпичное исполнение. "
            "Каскадная этажность. Подземный паркинг на 300 мест."
        ),
        "entrances_count": 2,
        "initial_payment_percent": 30.0,
        "installment_months": 35,
        "has_red_book": True,
        "description": "17 архитектурных блоков на территории 3,66 га. Сдача в 2027–2028 гг.",
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/levan-park-legal.docx",
    },
    {
        "name": "LEVEL LUX",
        "slug": "level-lux",
        "address": "Бишкек, в Первомайском районе, по ул. Айни  10/1",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "4 кв.",
        "completion_year": 2027,
        "price_per_sqm_usd": 1595.0,
        "price_per_sqm_kgs": 139845.0,
        "class_type": "premium",
        "floors": "14",
        "buildings_count": 2,
        "apartments_count": 168,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/level-lux.jpeg",
        "features": (
            "Этажи 1–8 — кирпич, 9–14 — газоблок D600. "
            "Фасад — керамика Laminam + клинкер. "
            "Домофон с Face ID. Бесшумные лифты."
        ),
        "entrances_count": 1,
        "installment_months": 18,
        "has_red_book": True,
        "description": "168 квартир, премиум-класс, участок 21,62 соток.",
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/level-lux-legal.docx",
    },
    {
        "name": "Аккула",
        "slug": "akkula",
        "address": "Бишкек, Ленинский р-н, по ул. Матыева Э. (бывш. Строительная), д. 21",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "4 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1400.0,
        "price_per_sqm_kgs": 122400.0,
        "class_type": "business",
        "floors": "17",
        "buildings_count": 1,
        "apartments_count": 544,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/akkula.jpeg",
        "features": (
            "Закрытый двор без машин. Автономная газовая котельная. "
            "Монолитный каркас с кирпичным заполнением. "
            "Панорамное остекление."
        ),
        "initial_payment_percent": 30.0,
        "installment_months": 35,
        "has_red_book": True,
        "description": "544 квартиры. Двухуровневый подземный паркинг на 250 мест.",
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/akkula-legal.pdf",
    },
    {
        "name": "Времена года",
        "slug": "vremena-goda",
        "address": "Бишкек, Октябрьский р-н, ул. А.Токомбаева 27/1.",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "4 кв.",
        "completion_year": 2027,
        "price_per_sqm_usd": 1700.0,
        "price_per_sqm_kgs": 148665.0,
        "class_type": "premium",
        "floors": "от 15 до 24",
        "buildings_count": 4,
        "apartments_count": 100,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/vremena-goda.jpeg",
        "features": (
            "4 башни («сезоны») от 15 до 24 этажей. Потолки 3,6 м. "
            "SPA-зона с бассейном. Закрытый двор с консьержем 24/7."
        ),
        "initial_payment_percent": 30.0,
        "installment_months": 18,
        "has_red_book": True,
        "description": "Премиум-квартал от СК «Елизавета» на Южной магистрали.",
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/vremena-goda-legal.docx",
    },
    {
        "name": "Горизонт",
        "slug": "gorizont",
        "address": "Чуй-ул. Ауэзова",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "2 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1300.0,
        "price_per_sqm_kgs": 113624.0,
        "class_type": "comfort",
        "floors": "16",
        "buildings_count": 4,
        "apartments_count": 378,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/gorizont.jpeg",
        "features": (
            "Монолитно-железобетонный каркас. Кирпич и газоблок. "
            "Панорамное остекление подъездов. Бесшумные лифты."
        ),
        "initial_payment_percent": 15.0,
        "installment_months": 32,
        "has_red_book": True,
        "description": "378 квартир, комфорт+, 4 блока, участок 60 соток.",
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/gorizont-legal.docx",
    },
    {
        "name": "Токио Сити",
        "slug": "tokio-city",
        "address": "Бишкек, Октябрьский р-н, по ул. 7-апреля (бывш. Шабдан баатыра), д. 1а/1 и 160б.",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "2 кв.",
        "completion_year": 2027,
        "price_per_sqm_usd": 1250.0,
        "price_per_sqm_kgs": 109312.0,
        "class_type": "comfort",
        "floors": "16",
        "buildings_count": 6,
        "apartments_count": 540,
        "verification_score": 0,
        "verification_status": "unverified",
        "image_url": "/images/tokio-city.jpeg",
        "features": (
            "Красная книга. Центральные коммуникации. "
            "Рассрочка до 32 месяцев. Двор без машин, подземный паркинг."
        ),
        "entrances_count": 10,
        "initial_payment_percent": 30.0,
        "installment_months": 35,
        "has_red_book": True,
        "description": "6 блоков по 16 этажей, 540 квартир. Сдача II кв. 2027.",
        "latitude": 42.87,
        "longitude": 74.57,
        "legal_file": "/documents/tokio-city-legal.docx",
    },
]


def build_admin_complex_documents(entry: dict) -> list[dict]:
    """Standard verification documents for admin-added complexes."""
    name = entry["name"]
    address = entry["address"]
    has_red = entry.get("has_red_book", False)
    legal_file = entry.get("legal_file")
    description = entry.get("description", "")
    features = entry.get("features", "")

    land_status = "pending" if has_red else "valid"
    permit_status = "valid"
    expertise_status = "pending"
    commissioning_status = "missing"
    ownership_status = "pending"

    land_notes = (
        f"Объект «{name}», адрес: {address}. "
        + (
            "Земельный участок на «красной книге» — требуется дополнительная проверка "
            "правоустанавливающих документов и договоров с собственником участка."
            if has_red
            else "Право застройки подтверждено. Рекомендуется сверить выписку ЕГРПНИ перед сделкой."
        )
    )

    permit_notes = (
        f"Архитектурно-градостроительное заключение по объекту «{name}». "
        f"{description} "
        "Объект включён в перечень строящихся. Сейсмоустойчивость — 8 баллов."
    )

    expertise_notes = (
        f"По объекту «{name}» положительное заключение госэкспертизы выдано на I этап "
        "(архитектурные и конструктивные решения). "
        "Заключение по II этапу (инженерные коммуникации) на момент проверки отсутствует — "
        "застройщику необходимо предоставить."
    )

    commissioning_notes = (
        f"Объект «{name}» находится в стадии строительства "
        f"(сдача: {entry.get('completion_quarter', '')} {entry.get('completion_year', '')}). "
        "Разрешение на ввод в эксплуатацию оформляется после завершения строительства."
    )

    ownership_notes = (
        f"По объекту «{name}» применяется схема предварительного договора купли-продажи / ДДУ. "
        f"{features[:200]}{'…' if len(features) > 200 else ''} "
        "Перед сделкой рекомендуется проверить условия договора и правовую связку с земельным участком."
    )

    docs = [
        {
            "doc_type": "land_title",
            "title": "Госакт о праве частной собственности на земельный участок",
            "status": land_status,
            "number": None,
            "issued_by": "ГУ «Кадастр»" if land_status == "valid" else None,
            "issued_date": None,
            "notes": land_notes,
            "file_url": legal_file if land_status == "valid" and legal_file else None,
            "is_public": True,
        },
        {
            "doc_type": "construction_permit",
            "title": "Архитектурно-градостроительное заключение",
            "status": permit_status,
            "number": None,
            "issued_by": "МП «Бишкекглавархитектура»",
            "issued_date": None,
            "notes": permit_notes,
            "file_url": None,
            "is_public": True,
        },
        {
            "doc_type": "expertise",
            "title": "Заключение государственной экспертизы проектно-технических решений",
            "status": expertise_status,
            "number": None,
            "issued_by": "Государственная экспертиза",
            "issued_date": None,
            "notes": expertise_notes,
            "file_url": None,
            "is_public": True,
        },
        {
            "doc_type": "commissioning",
            "title": "Разрешение на ввод в эксплуатацию",
            "status": commissioning_status,
            "number": None,
            "issued_by": None,
            "issued_date": None,
            "notes": commissioning_notes,
            "file_url": None,
            "is_public": True,
        },
        {
            "doc_type": "ownership_scheme",
            "title": "Схема оформления прав собственности",
            "status": ownership_status,
            "number": None,
            "issued_by": entry.get("developer") or "Застройщик",
            "issued_date": None,
            "notes": ownership_notes,
            "file_url": legal_file if legal_file and legal_file.endswith(".pdf") else None,
            "is_public": True,
        },
    ]
    return docs


def build_admin_legal_report(entry: dict) -> dict:
    name = entry["name"]
    return {
        "title": f"Правовое заключение — {name}",
        "summary": (
            f"Экспертная оценка законности строительства объекта «{name}» "
            f"({entry['address']}). Документ содержит сведения о разрешительной документации, "
            "земельном участке и правовых рисках для покупателя."
        ),
        "conclusion": (
            f"ОБЪЕКТ\n{name}, {entry['address']}\n"
            f"{entry.get('description', '')}\n\n"
            f"ХАРАКТЕРИСТИКИ\n{entry.get('features', '')}\n\n"
            + (
                "ЗЕМЕЛЬНЫЙ УЧАСТОК\nУчасток на «красной книге» — требуется проверка "
                "правоустанавливающих документов.\n\n"
                if entry.get("has_red_book")
                else ""
            )
            + "РАЗРЕШИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ\n"
            "АГЗ получено. Госэкспертиза I этапа — положительно. "
            "II этап (инженерные коммуникации) — отсутствует.\n\n"
            "РИСКИ И РЕКОМЕНДАЦИИ\n"
            "• Проверить договор с застройщиком перед сделкой\n"
            "• Уточнить статус земельного участка\n"
            "• Запросить заключение госэкспертизы II этапа\n\n"
            "Перед покупкой рекомендуется дополнительная юридическая проверка."
        ),
        "risk_level": "medium" if entry.get("has_red_book") else "low",
        "prepared_at": "15.01.2026",
        "file_path": entry.get("legal_file"),
    }
